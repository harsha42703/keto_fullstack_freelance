import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
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

export function QuestionPreview({
  onAddQuestions,
  setNewQuestion,
  setNewOptions,
  setCorrectAnswer,
}: {
  onAddQuestions: (questions: any[]) => void;
  setNewQuestion: (value: any) => void;
  setNewOptions: (value: any) => void;
  setCorrectAnswer: (value: any) => void;
}) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Debouncing logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // 300ms debounce delay
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchQuestions = async (term: string, page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/questions/all?search=${term}&page=${page}&limit=5`
      );
      const data = await response.json();
      setQuestions(data.questions || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedFetchProducts = useCallback(
    debounce((term: string, page: number) => {
      fetchQuestions(term, page);
    }, 500),
    [fetchQuestions]
  );

  // Trigger search when search term or page changes
  useEffect(() => {
    debouncedFetchProducts(searchTerm, currentPage);
  }, [searchTerm, currentPage]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="my-8">
          Add Questions from Question Bank
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Question Bank</DialogTitle>
          <DialogDescription>
            Select the questions you want to add to your quiz.
          </DialogDescription>
        </DialogHeader>
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
            ) : questions.length === 0 ? (
              <p>No questions found.</p>
            ) : (
              questions.map((question) => (
                <div key={question.id} className="flex justify-between m-2">
                  <div>
                    <span>{question.question}</span>
                  </div>
                  <DialogClose asChild>
                    <Button
                      onClick={(e) => {
                        setNewQuestion(question.question);
                        setNewOptions(question.keys.map((key: any) => key.key));
                        setCorrectAnswer(
                          question.keys.find((key: any) => key.correctkey)?.key
                        );
                      }}
                    >
                      Add
                    </Button>
                  </DialogClose>
                </div>
              ))
            )}
          </div>
        </div>
        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
