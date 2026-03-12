export default function AdminTable({ bookings }) {
  return (
    <div className="card-luxe overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-black/5">
            <tr>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Paid</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-black/5">
                <td className="px-4 py-3">{booking.full_name}</td>
                <td className="px-4 py-3">{booking.phone}</td>
                <td className="px-4 py-3">{booking.service_name}</td>
                <td className="px-4 py-3">{booking.booking_date}</td>
                <td className="px-4 py-3">{booking.booking_time}</td>
                <td className="px-4 py-3">{booking.status}</td>
                <td className="px-4 py-3">
                  {booking.payment_status === "paid" ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
