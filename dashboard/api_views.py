import csv
import io
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from django.db import connection
from django.utils.text import slugify
import datetime
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
from django.views.decorators.csrf import csrf_exempt
import pandas as pd

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
            decoded_file = file_obj.read().decode("utf-8").replace('\r', '\n')  # <- replace \r with \n
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string, delimiter=',')  # <- force comma as delimiter

            # decoded_file = file_obj.read().decode("utf-8")
            # io_string = io.StringIO(decoded_file)
            # reader = csv.DictReader(io_string)

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


# # ✅ NEW: Upload FinancialLineItem CSV

# # ✅ Enhanced: UploadFinancialLineItemsView with per-file summary

# # Do not use it
class UploadFinancialLineItemsView(APIView):
    pass
#     parser_classes = [MultiPartParser]
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         files = request.FILES.getlist("files")
#         if not files:
#             return Response({"error": "No files uploaded."}, status=status.HTTP_400_BAD_REQUEST)
        
#         total_rows = 0
#         total_skipped = 0
#         results = []

#         for file_obj in files:
#             skipped_rows_this_file = 0
#             uploaded_rows_this_file = 0

#             try:
#                 decoded_file = file_obj.read().decode("utf-8").replace('\r\n', '\n').replace('\r', '\n')
#                 io_string = io.StringIO(decoded_file)

#                 # Auto-detect delimiter (tab, comma, etc.)
#                 sample = io_string.read(2048)
#                 io_string.seek(0)

#                 try:
#                     dialect = csv.Sniffer().sniff(sample, delimiters=",\t;")
#                     if dialect.delimiter not in [',', '\t', ';']:
#                         print(f"⚠ Unknown delimiter `{repr(dialect.delimiter)}`, defaulting to comma.")
#                         dialect.delimiter = ','
#                 except csv.Error:
#                     print("⚠ Sniffer failed, using default comma delimiter.")
#                     dialect = csv.excel 

#                 print(f"📂 Parsing file: {file_obj.name}")
#                 print(f"🧭 Detected delimiter: {repr(dialect.delimiter)}")

#                 reader = csv.DictReader(io_string, dialect=dialect)
#                 reader.fieldnames = [field.strip().replace('\ufeff', '') for field in reader.fieldnames]

#                 required_fields = {"entity_name", "account_code", "ytd_actual", "annual_budget"}
#                 if not set(reader.fieldnames or []).issuperset(required_fields):
#                     return Response({
#                         "error": f"Missing required columns in {file_obj.name}. Found: {reader.fieldnames}"
#                     }, status=status.HTTP_400_BAD_REQUEST)


#                 items = []
#                 for row in reader:
#                     try:
#                         print("Parsed row:", row)  # ✅ moved safely inside the loop

#                         row = {k.strip(): (v.strip() if v else "") for k, v in row.items()}

#                         if not row.get("entity_name") or not row.get("account_code"):
#                             print(f"⚠ Skipping row due to missing required fields: {row}")
#                             skipped_rows_this_file += 1
#                             continue

#                         items.append(FinancialLineItem(
#                             user=request.user,
#                             entity_name=row.get("entity_name"),
#                             account_code=row.get("account_code"),
#                             description=row.get("description", ""),
#                             ytd_actual=float(row.get("ytd_actual") or 0),
#                             annual_budget=float(row.get("annual_budget") or 0),
#                             category=row.get("category", ""),
#                             item_type=row.get("item_type", "statement"),
#                             expense_nature=row.get("expense_nature") or "n/a",
#                         ))

#                     except Exception as row_error:
#                         print(f"❌ Skipping row due to error: {row_error}, row: {row}")
#                         skipped_rows_this_file += 1
#                         continue


#                 FinancialLineItem.objects.bulk_create(items)
#                 uploaded_rows_this_file = len(items)
#                 total_rows += uploaded_rows_this_file
#                 total_skipped += skipped_rows_this_file

#                 UploadedFile.objects.create(
#                     user=request.user,
#                     filename=file_obj.name,
#                 )

#                 results.append({
#                     "filename": file_obj.name,
#                     "rows_uploaded": uploaded_rows_this_file,
#                     "rows_skipped": skipped_rows_this_file,
#                 })

#             except Exception as e:
#                 import traceback
#                 traceback_str = traceback.format_exc()
#                 print(f"🔥 Error in file {file_obj.name}: {e}")
#                 print(traceback.format_exc())
#                 return Response(
#                     {"error": f"Error processing file {file_obj.name}: {str(e)}"},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )

#         return Response(
#             {
#                 "message": f"Successfully processed {len(files)} file(s).",
#                 "results": results,
#                 "total_uploaded_rows": total_rows,
#                 "total_skipped_rows": total_skipped,
#             },
#             status=status.HTTP_201_CREATED
#         )

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
        result = []

        for file in files:
            row_count = 0
            try:
                with connection.cursor() as cursor:
                    cursor.execute(f'SELECT COUNT(*) FROM "{file.table_name}"')
                    row_count = cursor.fetchone()[0]
            except Exception as e:
                print(f"Failed to get row count for table {file.table_name}: {e}")
                row_count = -1 

            result.append({
                "id": file.id,
                "filename": file.filename,
                "upload_time": file.upload_time,
                "table_name": file.table_name,
                "row_count": row_count,
            })

        return Response(result)

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
    print("Signup API called:", request.data)
    print("🍪 COOKIES:", request.COOKIES)
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
    


class UploadDynamicCSVView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        files = request.FILES.getlist("files")
        if not files:
            return Response({"error": "No files uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        total_uploaded_rows = 0
        total_skipped_rows = 0
        results = []

        if len(files) == 1:
            # When only one file is uploaded, process it as a single CSV
            file_obj = files[0]
            uploaded_rows = 0
            skipped_rows = 0
            try:
                decoded_file = file_obj.read().decode("utf-8").replace("\r\n", "\n").replace("\r", "\n")
                io_string = io.StringIO(decoded_file)

                sample = io_string.read(2048)
                io_string.seek(0)
                try:
                    dialect = csv.Sniffer().sniff(sample, delimiters=",\t;")
                    if dialect.delimiter not in [",", "\t", ";"]:
                        dialect.delimiter = ","
                except csv.Error:
                    dialect = csv.excel

                reader = csv.DictReader(io_string, dialect=dialect)
                reader.fieldnames = [field.strip().replace('\ufeff', '') for field in reader.fieldnames]

                fields = reader.fieldnames
                if not fields:
                    return Response({"error": "CSV file has no headers."}, status=400)

                base_name = slugify(file_obj.name.replace('.csv', ''))
                timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                table_name = f"user_{request.user.id}_{base_name}_{timestamp}"

                columns = ", ".join([f'"{field}" TEXT' for field in fields])
                create_table_sql = f'CREATE TABLE "{table_name}" (id INTEGER PRIMARY KEY AUTOINCREMENT, {columns})'

                with connection.cursor() as cursor:
                    cursor.execute(create_table_sql)
                    for row in reader:
                        values = [row.get(field, '').strip() for field in fields]
                        if not any(values):
                            skipped_rows += 1
                            continue
                        placeholders = ", ".join(["?"] * len(values))
                        insert_sql = f'INSERT INTO "{table_name}" ({", ".join(fields)}) VALUES ({placeholders})'
                        cursor.execute(insert_sql, values)
                        uploaded_rows += 1

                UploadedFile.objects.create(
                    user=request.user,
                    filename=file_obj.name,
                    table_name=table_name
                )

                results.append({
                    "filename": file_obj.name,
                    "table": table_name,
                    "rows_uploaded": uploaded_rows,
                    "rows_skipped": skipped_rows
                })

                total_uploaded_rows += uploaded_rows
                total_skipped_rows += skipped_rows

            except Exception as e:
                import traceback
                traceback.print_exc()
                results.append({"filename": file_obj.name, "error": str(e)})

        else:
            # When multiple files are uploaded, combine them into a single DataFrame
            combined_df = pd.DataFrame()
            error_files = []
            headers_set = None  # Use to track headers across files
            
            for file_obj in files:
                try:
                    df = pd.read_csv(file_obj)

                    # skip empty files
                    if df.empty:
                        error_files.append(file_obj.name)
                        continue

                    # Clean column names
                    df.columns = [str(col).strip().replace('\ufeff', '') for col in df.columns]

                    # Check if headers match
                    if headers_set is None:
                        headers_set = df.columns.tolist()
                    elif df.columns.tolist() != headers_set:
                        print(f"Column mismatch in '{file_obj.name}':\nExpected: {headers_set}\nFound: {df.columns.tolist()}")
                        return Response({
                            "error": f"Column mismatch detected in file '{file_obj.name}'.",
                            "expected_columns": headers_set,
                            "found_columns": df.columns.tolist()
                        }, status=400)

                    combined_df = pd.concat([combined_df, df], ignore_index=True)

                except Exception as e:
                    error_files.append(file_obj.name + f" (error: {str(e)})")

            if combined_df.empty:
                return Response({"error": f"All uploaded files failed or were empty: {error_files}"}, status=400)

            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            table_name = f"user_{request.user.id}_combined_{timestamp}"

            with connection.cursor() as cursor:
                columns_sql = ", ".join([f'"{col}" TEXT' for col in combined_df.columns])
                cursor.execute(f'DROP TABLE IF EXISTS "{table_name}"')
                cursor.execute(f'CREATE TABLE "{table_name}" (id INTEGER PRIMARY KEY AUTOINCREMENT, {columns_sql})')

            combined_df.to_sql(table_name, connection, if_exists='append', index=False)

            UploadedFile.objects.create(
                user=request.user,
                filename="Multiple Combined Upload",
                table_name=table_name
            )

            results.append({
                "filename": "Multiple Combined Upload",
                "table": table_name,
                "rows_uploaded": combined_df.shape[0],
                "rows_skipped": 0
            })

            total_uploaded_rows = combined_df.shape[0]
            total_skipped_rows = 0


        return Response({
            "message": f"Processed {len(files)} file(s).",
            "results": results,
            "total_uploaded_rows": total_uploaded_rows,
            "total_skipped_rows": total_skipped_rows,
        }, status=status.HTTP_201_CREATED)



@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_uploaded_file(request, file_id):
    try:
        file = UploadedFile.objects.get(id=file_id, user=request.user)
        table_name = file.table_name

        # Delete the table from the database
        with connection.cursor() as cursor:
            cursor.execute(f'DROP TABLE IF EXISTS "{table_name}"')

        # Delete the UploadedFile record
        file.delete()

        return Response({"message": "File and associated table deleted successfully."}, status=200)
    except UploadedFile.DoesNotExist:
        return Response({"error": "File not found."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)