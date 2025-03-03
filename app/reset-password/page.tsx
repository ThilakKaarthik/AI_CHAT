const handleResetPassword = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match!", { position: "bottom-right" });
    setLoading(false);
    return;
  }

  if (!passwordRegex.test(newPassword)) {
    toast.error(
      "Password must be at least 6 characters long, include one uppercase letter, one lowercase letter, and one special character.",
      { position: "bottom-right" }
    );
    setLoading(false);
    return;
  }

  // Get the current user session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    toast.error("Session expired or missing. Please log in again.", {
      position: "bottom-right",
    });
    setLoading(false);
    return;
  }

  // Now, update the password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    toast.error(error.message || "Failed to reset password.", {
      position: "bottom-right",
    });
  } else {
    toast.success("Password reset successfully!", { position: "bottom-right" });
    router.push("/login");
  }

  setLoading(false);
};
