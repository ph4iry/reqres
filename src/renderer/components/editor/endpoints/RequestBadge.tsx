type HTTPRequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";



export default function ReqMethodBadge({ method }:{ method: HTTPRequestMethod}) {
  const getMethodColor = (method: HTTPRequestMethod) => {
    const colors = {
      GET: 'text-blue-500 bg-blue-400/10 border-blue-200',
      POST: 'text-green-500 bg-green-400/10 border-green-200',
      PUT: 'text-amber-500 bg-amber-400/10 border-amber-200',
      DELETE: 'text-red-500 bg-red-400/10 border-red-200',
      PATCH: 'text-purple-500 bg-purple-400/10 border-purple-200',
      HEAD: 'text-gray-500 bg-gray-400/10 border-gray-200',
      OPTIONS: 'text-gray-500 bg-gray-400/10 border-gray-200',
    };
    return colors[method];
  }

  return (
    <span className={`p-2 rounded-md ${getMethodColor(method)}`}>
      {method}
    </span>
  )
}