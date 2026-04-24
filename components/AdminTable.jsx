return (
  <div className="admin-dashboard-layout">

    {/* ===== الفلاتر أعلى الجدول ===== */}
    <div className="rounded-3xl bg-white p-4 shadow-luxe mb-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">

        <input
          className="input-luxe max-w-xs"
          placeholder="بحث بالاسم أو الجوال"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select className="input-luxe max-w-[150px]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">كل الحالات</option>
          <option value="pending">تحت الإجراء</option>
          <option value="confirmed">مؤكد</option>
          <option value="cancelled">ملغي</option>
        </select>

        <select className="input-luxe max-w-[150px]" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="all">كل المواعيد</option>
          <option value="today">اليوم</option>
          <option value="tomorrow">غدًا</option>
        </select>

        <button className="btn-primary" onClick={() => refreshBookings()}>
          تحديث
        </button>

        <button className="btn-gold" onClick={resetFilters}>
          إعادة ضبط
        </button>

      </div>
    </div>

    {/* ===== الإحصائيات ===== */}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5 mb-4">
      <StatCard label="كل الطلبات" value={stats.total} />
      <StatCard label="تحت الإجراء" value={stats.pending} tone="amber" />
      <StatCard label="مؤكد" value={stats.confirmed} tone="green" />
      <StatCard label="ملغي" value={stats.cancelled} tone="red" />
      <StatCard label="اليوم" value={stats.today} />
    </div>

    {/* ===== الجدول ===== */}
    <div className="rounded-3xl border border-black/5 bg-white shadow-luxe">
      <div className="px-5 py-4 border-b">
        <h3 className="text-xl font-extrabold">جميع الحجوزات</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>العميلة</th>
              <th>الخدمة</th>
              <th>التاريخ</th>
              <th>الوقت</th>
              <th>المبلغ</th>
              <th>الحالة</th>
              <th>الإجراء</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((booking, index) => (
              <tr key={booking.id} className="hover:bg-[#fffaf3]">

                <td>{index + 1}</td>

                <td>
                  <div className="font-bold">{booking.name}</div>
                  <div className="text-xs text-gray-500" dir="ltr">{booking.phone}</div>
                </td>

                <td>{booking.service}</td>

                <td>{booking.date}</td>

                <td>{getDisplayTime(booking.time)}</td>

                <td>{formatCurrency(booking.price)}</td>

                <td>
                  <StatusBadge status={booking.status} />
                </td>

                <td>
                  <div className="flex gap-2 justify-center">

                    <button
                      className="action-pill bg-emerald-100 text-emerald-800"
                      onClick={() => onUpdate(booking.id, { status: "confirmed" })}
                    >
                      ✔
                    </button>

                    <button
                      className="action-pill bg-red-100 text-red-800"
                      onClick={() => onUpdate(booking.id, { status: "cancelled" })}
                    >
                      ✖
                    </button>

                    <a
                      className="action-pill bg-[#25D366]/15 text-[#128C3A]"
                      href={buildCustomerWhatsAppUrl(booking.phone, {
                        name: booking.name,
                        serviceLabel: booking.service,
                        date: booking.date,
                        time: getDisplayTime(booking.time),
                      })}
                      target="_blank"
                    >
                      واتساب
                    </a>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  </div>
);
