interface Users {
  userID: string;
  name: string;
  email: string;
  googleAuthID: string;
  role: string;
  profilePicture: string | null;
  dateRegistered: string;
  isActive: boolean;
}

export default Users;
