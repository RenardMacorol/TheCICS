interface Users {
  userID: string;
  name: string;
  email: string;
  googleAuthID: string;
  role: string;
  profilePicture: string | null;
  dateRegistered: string;
}

export default Users;
