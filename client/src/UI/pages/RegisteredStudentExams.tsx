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
import { Link } from "react-router-dom";

export function RegisteredStudentExams() {
  const [exams, setExams] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchQuestions = async (term: string, page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/exams/all?search=${term}&page=${page}&limit=5`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setExams(data.user.registeredExams || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchProducts = useCallback(
    debounce((term: string, page: number) => {
      fetchQuestions(term, page);
    }, 500),
    [fetchQuestions]
  );

  useEffect(() => {
    debouncedFetchProducts(searchTerm, currentPage);
  }, [searchTerm, currentPage]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    <>
      <div className="grid gap-4 py-4">
        <Input
          placeholder="Search the questions"
          id="search"
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="mt-4 space-y-2">
          {loading ? (
            <p>Loading questions...</p>
          ) : exams.length === 0 ? (
            <p>No questions found.</p>
          ) : (
            exams.map((exam) => (
              <div key={exam.id} className="flex justify-between m-2">
                <div>
                  <Card className="max-w-md w-[40vw] mx-auto shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold">
                          {exam.exam_name}
                        </CardTitle>
                        <Badge
                          // variant={exam.isApproved ? "default" : "destructive"}
                          className="px-3 py-1"
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
                          <Link to={`/student/attempt/${exam.id}`}>
                            {" "}
                            <Button className="w-full">start exam</Button>
                          </Link>
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

export default RegisteredStudentExams;
