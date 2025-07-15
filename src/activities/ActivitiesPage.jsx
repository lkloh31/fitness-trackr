import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";
import { useAuth } from "../auth/AuthContext";

export default function ActivitiesPage(activity) {
  const { token } = useAuth();

  const {
    data: activities,
    loading,
    error,
  } = useQuery("/activities", "activities");

  const {
    mutate: addActivity,
    loading: adding,
    error: addError,
  } = useMutation("POST", "/activities", ["activities"]);

  const {
    mutate: deleteActivity,
    loading: deleting,
    error: deleteError,
  } = useMutation("DELETE", "", ["activities"]);

  const handleAddActivity = (formData) => {
    const name = formData.get("name");
    const description = formData.get("description");
    addActivity({ name, description });
  };

  const handleDeleteActivity = (activityId) => {
    deleteActivity(null, `/activities/${activityId}`);
  };

  return (
    <>
      <h1>Activities</h1>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {Array.isArray(activities) &&
        activities.map((activity) => (
          <ul key={activity.id}>
            <li>{activity.name}</li>
            {token && (
              <button
                onClick={() => handleDeleteActivity(activity.id)}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </ul>
        ))}

      {deleteError && (
        <p style={{ color: "red" }}>Delete Error: {deleteError}</p>
      )}

      {token && (
        <>
          <h2>Add New Activity</h2>
          <form action={handleAddActivity}>
            <label>
              Name: <input name="name" required />
            </label>
            <label>
              Description: <input name="description" required />
            </label>
            <button type="submit" disabled={adding}>
              {adding ? "Adding..." : "Add Activity"}
            </button>
          </form>
          {addError && <p style={{ color: "red" }}>Add Error: {addError}</p>}
        </>
      )}
    </>
  );
}
