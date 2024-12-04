import { Card, CardContent } from "@/components/ui/card";
import { Assignment } from "@/types";

interface AssignmentListProps {
  assignments: Assignment[];
  onAssignmentClick: (assignment: Assignment) => void;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  onAssignmentClick,
}) => (
  <div className="space-y-4">
    {assignments.map((assignment) => (
      <Card
        key={assignment.id}
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => onAssignmentClick(assignment)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">{assignment.title}</h4>
              <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                assignment.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : assignment.status === "SUBMITTED"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {assignment.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {assignment.description}
          </p>
          {assignment.grade && (
            <div className="mt-2 text-sm">
              <span className="font-medium">Grade:</span> {assignment.grade}%
            </div>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
);
