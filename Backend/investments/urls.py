from django.urls import path
from .views import InvestmentListCreateView

# URL endpoints for the investments app
urlpatterns = [
    # Base route for viewing and creating investments
    path('', InvestmentListCreateView.as_view(), name='investments'),
]
