import csv
import io
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser

# from .models import FinancialData
from .models import FinancialLineItem
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from rest_framework.generics import ListAPIView
from .models import FinancialLineItem, UploadedFile
from .serializers import FinancialLineItemSerializer  # ✅ already present, reused below
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import logout
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

class FinancialLineItemListView(ListAPIView):
    queryset = FinancialLineItem.objects.all()
    serializer_class = FinancialLineItemSerializer
    permission_classes = [IsAuthenticated]


class UploadCSVView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        file_obj = request.FILES.get("file")
        if not file_obj:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_file = file_obj.read().decode("utf-8")
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)

            for row in reader:
                FinancialData.objects.create(
                    entity_name=row.get("entity_name"),
                    sales=row.get("sales"),
                    cost_of_sales=row.get("cost_of_sales"),
                    gross_profit=row.get("gross_profit"),
                    administrative_expenses=row.get("administrative_expenses"),
                    other_income=row.get("other_income"),
                    ebitda=row.get("ebitda"),
                    depreciation_and_amortization=row.get("depreciation_and_amortization"),
                    ebit=row.get("ebit"),
                    finance_costs=row.get("finance_costs"),
                    profit_before_tax=row.get("profit_before_tax"),
                    income_tax=row.get("income_tax"),
                    profit_for_period=row.get("profit_for_period"),
                )

            return Response({"message": "CSV uploaded and financial data saved."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class FinancialDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = FinancialData.objects.all().values(
            "entity_name", "sales", "cost_of_sales", "gross_profit",
            "administrative_expenses", "other_income", "ebitda",
            "depreciation_and_amortization", "ebit", "finance_costs",
            "profit_before_tax", "income_tax", "profit_for_period"
        )
        return Response(list(data))


@method_decorator(csrf_exempt, name='dispatch')
class SessionLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


# ✅ NEW: Upload FinancialLineItem CSV

# ✅ Enhanced: UploadFinancialLineItemsView with per-file summary

class UploadFinancialLineItemsView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        files = request.FILES.getlist("files")
        if not files:
            return Response({"error": "No files uploaded."}, status=status.HTTP_400_BAD_REQUEST)
        
        total_rows = 0
        total_skipped = 0
        results = []

        for file_obj in files:
            skipped_rows_this_file = 0
            uploaded_rows_this_file = 0

            try:
                decoded_file = file_obj.read().decode("utf-8")
                io_string = io.StringIO(decoded_file)

                # Auto-detect delimiter (tab, comma, etc.)
                sample = io_string.read(1024)
                io_string.seek(0)

                try:
                    dialect = csv.Sniffer().sniff(sample)
                    if dialect.delimiter not in [',', '\t']:
                        print(f"⚠ Unknown delimiter `{repr(dialect.delimiter)}`, defaulting to tab.")
                        dialect.delimiter = '\t'
                except csv.Error:
                    print("⚠ Sniffer failed, using default tab delimiter.")
                    dialect = csv.excel_tab

                print(f"📂 Parsing file: {file_obj.name}")
                print(f"🧭 Detected delimiter: {repr(dialect.delimiter)}")

                reader = csv.DictReader(io_string, dialect=dialect)
                reader.fieldnames = [field.strip().replace('\ufeff', '') for field in reader.fieldnames]

                items = []
                for row in reader:
                    try:
                        print("Parsed row:", row)  # ✅ moved safely inside the loop

                        row = {k.strip(): (v.strip() if v else "") for k, v in row.items()}

                        if not row.get("entity_name") or not row.get("account_code"):
                            print(f"⚠ Skipping row due to missing required fields: {row}")
                            skipped_rows_this_file += 1
                            continue

                        items.append(FinancialLineItem(
                            entity_name=row.get("entity_name"),
                            account_code=row.get("account_code"),
                            description=row.get("description", ""),
                            ytd_actual=float(row.get("ytd_actual") or 0),
                            annual_budget=float(row.get("annual_budget") or 0),
                            category=row.get("category", ""),
                            item_type=row.get("item_type", "statement"),
                            expense_nature=row.get("expense_nature") or "n/a",
                        ))

                    except Exception as row_error:
                        print(f"❌ Skipping row due to error: {row_error}, row: {row}")
                        skipped_rows_this_file += 1
                        continue


                FinancialLineItem.objects.bulk_create(items)
                uploaded_rows_this_file = len(items)
                total_rows += uploaded_rows_this_file
                total_skipped += skipped_rows_this_file

                UploadedFile.objects.create(
                    user=request.user,
                    filename=file_obj.name,
                )

                results.append({
                    "filename": file_obj.name,
                    "rows_uploaded": uploaded_rows_this_file,
                    "rows_skipped": skipped_rows_this_file,
                })
                
            except Exception as e:
                return Response(
                    {"error": f"Error processing file {file_obj.name}: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(
            {
                "message": f"Successfully processed {len(files)} file(s).",
                "results": results,
                "total_uploaded_rows": total_rows,
                "total_skipped_rows": total_skipped,
            },
            status=status.HTTP_201_CREATED
        )


# class UploadFinancialLineItemsView(APIView):
#     parser_classes = [MultiPartParser]
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         file_obj = request.FILES.get("file")
#         if not file_obj:
#             return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             decoded_file = file_obj.read().decode("utf-8")
#             io_string = io.StringIO(decoded_file)
#             reader = csv.DictReader(io_string)

#             items = []
#             for row in reader:
#                 try:
#                     items.append(FinancialLineItem(
#                         entity_name=row.get("entity_name"),
#                         account_code=row.get("account_code"),
#                         description=row.get("description"),
#                         ytd_actual=float(row.get("ytd_actual") or 0),
#                         annual_budget=float(row.get("annual_budget") or 0),
#                         category=row.get("category", ""),
#                         item_type=row.get("item_type", "statement"),
#                         expense_nature=row.get("expense_nature") or None,
#                     ))
#                 except Exception as row_error:
#                     print(f"Skipping row due to error: {row_error}, row: {row}")
#                     continue

#             FinancialLineItem.objects.bulk_create(items)
#             return Response({"message": f"{len(items)} rows uploaded."}, status=status.HTTP_201_CREATED)

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# ✅ MODIFIED: Use serializer to return computed fields like gross_profit
class FinancialLineItemsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = FinancialLineItem.objects.all()
        serializer = FinancialLineItemSerializer(queryset, many=True)
        return Response(serializer.data)
    

# get all items uploaded by the current user
class MyUploadedItemsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = FinancialLineItem.objects.filter(user=request.user).order_by("-id")
        serializer = FinancialLineItemSerializer(items, many=True)
        return Response(serializer.data)
    
class MyUploadedFilesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        files = UploadedFile.objects.filter(user=request.user).order_by("-upload_time")
        data = [
            {
                "filename": file.filename,
                "upload_time": file.upload_time,
            }
            for file in files
        ]
        return Response(data)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def LogoutAPIView(request):
    logout(request)
    return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def signup_api_view(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)


# Get /api/current-user/
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
        })
    
# Post /api/update-profile/
class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_email = request.data.get("new_email")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        # update email without password check
        if new_email:
            user.email = new_email
            user.save()
            return Response({"message": "Email updated successfully"}, status=200)
        
        # update password with password check
        if current_password and new_password and confirm_password:
            if not user.check_password(current_password):
                return Response({"error": "Current password is incorrect"}, status=400)
            if new_password != confirm_password:
                return Response({"error": "New password and confirm password do not match"}, status=400)
            
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password updated successfully. Please re-login"}, status=200)
        
        return Response({"error": "Invalid request"}, status=400)