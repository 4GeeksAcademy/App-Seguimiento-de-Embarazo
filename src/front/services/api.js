export const getDashboard = async (user_id) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/${user_id}`)

  if (!response.ok) {
    throw new Error("Error loading dashboard")
  }

  return await response.json()
}