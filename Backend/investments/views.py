from rest_framework import generics, permissions
from .models import Investment
from .serializers import InvestmentSerializer


# List all investments of the logged-in user
# or create a new one
class InvestmentListCreateView(generics.ListCreateAPIView):
    serializer_class = InvestmentSerializer  # the serializer to use
    permission_classes = [permissions.IsAuthenticated]  # only logged-in users can access this

    # Filter the queryset to show only the current user's investments
    def get_queryset(self):
        return Investment.objects.filter(investor=self.request.user)

    # When creating a new investment, automatically set the investor
    def perform_create(self, serializer):
        serializer.save(investor=self.request.user)
