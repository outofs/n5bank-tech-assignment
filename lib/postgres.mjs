export function normalizePostgresConnectionString(connectionString) {
  if (!connectionString) {
    return connectionString;
  }

  try {
    const url = new URL(connectionString);
    const sslmode = url.searchParams.get("sslmode");

    if (
      !sslmode ||
      sslmode === "prefer" ||
      sslmode === "require" ||
      sslmode === "verify-ca"
    ) {
      url.searchParams.set("sslmode", "verify-full");
    }

    return url.toString();
  } catch {
    return connectionString;
  }
}
