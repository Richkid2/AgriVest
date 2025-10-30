from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Project
from .serializers import ProjectSerializer



# List all projects or create a new one
class ProjectListCreateView(generics.ListCreateAPIView):

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """Allow only farmers to create a project."""
        if self.request.user.role != 'farmer':
            raise PermissionDenied("Only farmers can create projects.")
        serializer.save(farmer=self.request.user)


#View, update, or delete a single project
class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

