import csv
import io
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
# from .models import FinancialData
from .models import FinancialLineItem
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from rest_framework.generics import ListAPIView
from .models import FinancialLineItem
from .serializers import FinancialLineItemSerializer  # ✅ already present, reused below
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import logout

class FinancialLineItemListView(ListAPIView):
    queryset = FinancialLineItem.objects.all()
    serializer_class = FinancialLineItemSerializer


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
class UploadFinancialLineItemsView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file_obj = request.FILES.get("file")
        if not file_obj:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_file = file_obj.read().decode("utf-8")
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)

            items = []
            for row in reader:
                try:
                    items.append(FinancialLineItem(
                        entity_name=row.get("entity_name"),
                        account_code=row.get("account_code"),
                        description=row.get("description"),
                        ytd_actual=float(row.get("ytd_actual") or 0),
                        annual_budget=float(row.get("annual_budget") or 0),
                        category=row.get("category", ""),
                        item_type=row.get("item_type", "statement"),
                    ))
                except Exception as row_error:
                    print(f"Skipping row due to error: {row_error}, row: {row}")
                    continue

            FinancialLineItem.objects.bulk_create(items)
            return Response({"message": f"{len(items)} rows uploaded."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ✅ MODIFIED: Use serializer to return computed fields like gross_profit
class FinancialLineItemsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = FinancialLineItem.objects.all()
        serializer = FinancialLineItemSerializer(queryset, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def LogoutAPIView(request):
    logout(request)
    return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)