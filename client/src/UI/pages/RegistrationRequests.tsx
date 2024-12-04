import { useEffect, useState } from "react";

const RegistrationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/registration-requests"
      );
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      alert("Failed to fetch registration requests.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/registration-requests/${id}/approve`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        alert("Request approved successfully.");
        fetchRequests();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to approve request.");
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/registration-requests/${id}/reject`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        alert("Request rejected successfully.");
        fetchRequests();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to reject request.");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Registration Requests</h1>
      {isLoading ? (
        <p>Loading requests...</p>
      ) : requests.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request: any) => (
              <tr key={request.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {request.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {request.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {request.role}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {!request.status && "Pending"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {!request.status ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500">{request.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No registration requests found.</p>
      )}
    </div>
  );
};

export default RegistrationRequests;
