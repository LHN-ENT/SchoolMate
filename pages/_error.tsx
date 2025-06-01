function Error({ statusCode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] text-[#1A1A1A] font-sans p-6">
      <div className="bg-white p-6 rounded-xl shadow max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#004225]">⚠️ Something went wrong</h1>
        <p className="text-slate-700 text-sm">
          {statusCode
            ? `An error ${statusCode} occurred on server.`
            : 'An error occurred on client.'}
        </p>
        <p className="text-xs text-slate-400">Try refreshing the page or coming back later.</p>
      </div>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
