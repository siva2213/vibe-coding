import type { Patient } from "../types/patient";

interface PatientTableProps {
  patients: Patient[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadgeColor(status: Patient["status"]): string {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Discharged":
      return "bg-gray-100 text-gray-800";
    case "In Treatment":
      return "bg-blue-100 text-blue-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function PatientTable({ patients }: PatientTableProps): JSX.Element {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-white border border-gray-200" aria-label="Patient data table">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Patient Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Age
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Date of Admission
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Doctor Assigned
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Last Visit Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                    patient.status,
                  )}`}
                >
                  {patient.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.age}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatDate(patient.dateOfAdmission)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.doctorAssigned}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.department}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(patient.lastVisitDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
