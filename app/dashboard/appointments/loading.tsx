export default function LoadingAppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="h-10 bg-gray-200 rounded w-56 animate-pulse"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="h-28 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
      <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
    </div>
  )
}
