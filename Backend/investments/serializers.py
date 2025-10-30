from rest_framework import serializers
from .models import Investment


# Converts Investment model data to JSON data for API
class InvestmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investment
        
        fields = ['id', 'investor', 'project', 'amount', 'status', 'created_at']
        read_only_fields = ['investor', 'created_at']
