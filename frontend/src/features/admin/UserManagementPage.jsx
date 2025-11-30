import React from 'react';

export default function UserManagementPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Kullanıcı Yönetimi</h1>
      <p className="text-sm text-slate-300">
        /users endpoint'inden gelen veriler ile kullanıcı listesi ve rol yönetimi yapılabilir.
      </p>
    </div>
  );
}
