from rest_framework import serializers
from .models import FinancialLineItem

class FinancialLineItemSerializer(serializers.ModelSerializer):
    gross_profit = serializers.SerializerMethodField()
    ebitda = serializers.SerializerMethodField()
    ebit = serializers.SerializerMethodField()
    profit_before_tax = serializers.SerializerMethodField()
    profit_for_period = serializers.SerializerMethodField()
    percent_used = serializers.SerializerMethodField()

    class Meta:
        model = FinancialLineItem
        fields = [
            "entity_name",
            "description",
            "item_type",
            "category",
            "ytd_actual",
            "annual_budget",
            "gross_profit",
            "ebitda",
            "ebit",
            "profit_before_tax",
            "profit_for_period",
            "percent_used",
        ]

    def get_gross_profit(self, obj):
        return obj.gross_profit

    def get_ebitda(self, obj):
        return obj.ebitda

    def get_ebit(self, obj):
        return obj.ebit

    def get_profit_before_tax(self, obj):
        return obj.profit_before_tax

    def get_profit_for_period(self, obj):
        return obj.profit_for_period

    def get_percent_used(self, obj):
        percent = obj.percent_used
        return round(percent, 2) if percent is not None else None
