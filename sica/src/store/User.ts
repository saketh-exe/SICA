import { create } from "zustand";
import { persist } from 'zustand/middleware';
interface userInterface {
    user : string 
    setUser : (by:string) => void
    clearUser : () => void
}
type chatType = {
  chat: { text: string; user: string,model:string }[];
  setChat: (chat: { text: string; user: string,model:string  }[]) => void;
};
const chatState = create<chatType>()(
  (set) => ({
    chat: [],
    setChat: (chat) => {
      console.log(chat);
      set({ chat });
    }
  })
);
 
const userState = create<userInterface>()(
    persist(
      (set) => ({
        user: "",
        setUser: (user) => {
          console.log(user);
          set({ user });
        },
        clearUser :  () => {
            set({user : ""})
        },
      }),
      {
        name: "user-storage", // LocalStorage key
      }
    )
  );

export {userState,chatState}