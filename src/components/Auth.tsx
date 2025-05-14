export function Auth({
  actionText,
  onSubmit,
  status,
  afterSubmit,
  showRoleSelector = false,
}: {
  actionText: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  status: 'pending' | 'idle' | 'success' | 'error'
  afterSubmit?: React.ReactNode
  showRoleSelector?: boolean
}) {
  return (
    <div className="fixed inset-0 bg-white dark:bg-black flex items-start justify-center p-8">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">{actionText}</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(e)
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="block text-xs">
              Username
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="px-2 py-1 w-full rounded border border-gray-500/20 bg-white dark:bg-gray-800"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="px-2 py-1 w-full rounded border border-gray-500/20 bg-white dark:bg-gray-800"
            />
          </div>
          {showRoleSelector && (
            <div>
              <label htmlFor="role" className="block text-xs">
                Role
              </label>
              <select
                name="role"
                id="role"
                className="px-2 py-1 w-full rounded border border-gray-500/20 bg-white dark:bg-gray-800"
                required
              >
                <option value="" disabled selected>
                  Select a role
                </option>
                <option value="parent">Parent</option>
                <option value="nanny">Nanny</option>
              </select>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white rounded py-2 font-black uppercase"
            disabled={status === 'pending'}
          >
            {status === 'pending' ? '...' : actionText}
          </button>
          {afterSubmit ? afterSubmit : null}
        </form>
      </div>
    </div>
  )
}