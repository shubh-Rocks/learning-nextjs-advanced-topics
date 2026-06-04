import Link from "next/link";

const Home = async () => {
  const user = false;
  return (
    <div className="max-w-4xl mx-auto ">
      <h1 className="text-3xl font-bold mb-6"> team Access Control demo</h1>
      <p className="text-slate-300 mb-8">
        this demo showcase Next.js 16 access control features with role-based
        permission
      </p>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 p-6 border border-slate-700 rounded-lg">
          <h3 className="font-semibold mb-3 text-white">
            Features Demonstrated
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
            <li>role-based access control (RABC)</li>
            <li>Route protection wit middleware</li>
            <li>server-side permission checks</li>
            <li>Client-side permission hooks</li>
            <li>Dynamic route access</li>
          </ul>
        </div>

        <div className="bg-slate-800 p-6 border border-slate-700 rounded-lg">
          <h3 className="font-semibold mb-3 text-white">User Roles</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
            <li>
              <strong>Super Admin:</strong>Full system Access
            </li>
            <li>
              <strong>Admin:</strong> User & team management{" "}
            </li>
            <li>
              <strong>Manager:</strong> Team specific management
            </li>
            <li>
              <strong>User:</strong> Basic dasboard
            </li>
          </ul>
        </div>
      </div>
      {user ? (
        <div className="bg-green-900/30 border-green-600 rounded-lg p-4">
          <p className="text-green-300">
            Wellcome back,<strong>Shubh</strong>! you are logged in as
            <strong className="text-green-200">USER</strong>
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white"
          >
            Go to dashboard
          </Link>
        </div>
      ) : (
        <div className="bg-green-900/30 border-green-600 rounded-lg p-4 ">
          <p className="text-green-300 mb-3">
            Wellcome back,<strong>Shubh</strong>! you are logged in as
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
