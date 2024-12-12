import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge, CheckCircle2, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/Context/userContext";

export function StudentExams() {
  const [exams, setExams] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { user } = useUser();
  // Debounce search term to reduce unnecessary fetches
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch exams data
  const fetchExams = async (term: string, page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/exams/all?search=${term}&page=${page}&limit=5`
      );
      const data = await response.json();
      setExams(data.exams || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchExams = useCallback(
    debounce((term: string, page: number) => {
      fetchExams(term, page);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedFetchExams(debouncedSearch, currentPage);
  }, [debouncedSearch, currentPage]);

  // Handle exam registration
  const handleRegister = async (examId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/register-for-exam`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ examId, userId: user.id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register for the exam");
      }

      // Refresh exams list after successful registration
      fetchExams(debouncedSearch, currentPage);
    } catch (error) {
      console.error("Error registering for the exam:", error);
    }
  };

  const handleAttemptExam = (examId: string) => {
    console.log(`Starting attempt for exam ID: ${examId}`);
    // Implement the navigation or logic to start the exam attempt
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="grid gap-4 py-4">
        <Input
          placeholder="Search exams"
          id="search"
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="mt-4 space-y-2">
          {loading ? (
            <p>Loading exams...</p>
          ) : exams.length === 0 ? (
            <p>No exams found.</p>
          ) : (
            exams.map((exam) => (
              <div key={exam.id} className="flex justify-between m-2">
                <div>
                  <Card className=" max-w-md w-[40vw] mx-auto shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold">
                          {exam.exam_name}
                        </CardTitle>
                        <Badge
                          className="px-3 py-1"
                          // variant={exam.isApproved ? "default" : "destructive"}
                        >
                          {exam.isApproved ? "Approved" : "Pending"}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center space-x-2">
                        <span>Exam Code: {exam.exam_code}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Clock className="w-5 h-5" />
                          <span>Duration: {exam.duration} minutes</span>
                        </div>

                        <div className="flex space-x-2">
                          {!exam.isRegistered ? (
                            <Button
                              onClick={() => handleRegister(exam.id)}
                              className="w-full"
                              disabled={!exam.isApproved}
                            >
                              Register for Exam
                            </Button>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => handleAttemptExam(exam.id)}
                                  className="w-full"
                                >
                                  <CheckCircle2 className="mr-2 w-5 h-5" />
                                  Attempt Exam
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Exam Confirmation</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p>
                                    Are you sure you want to start the exam?
                                  </p>
                                  <p>Exam: {exam.exam_name}</p>
                                  <p>Duration: {exam.duration} minutes</p>
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        /* Close dialog */
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => handleAttemptExam(exam.id)}
                                    >
                                      Start Exam
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              />
            </PaginationItem>

            {Array.from({ length: Math.ceil(totalPages) }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  currentPage < totalPages && paginate(currentPage + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}

export default StudentExams;
