import { create } from "zustand";
import { persist } from 'zustand/middleware';
interface userInterface {
    user : string 
    setUser : (by:string) => void
    clearUser : () => void
}
type messageType = { text: string; sender: string,model:string }
type chatType = {
  id : number
  chat: messageType[];
  setChat: (chat: messageType[]) => void;
  setId : (id:number) => void
  addMessage : (message : messageType) => void
  clearChat : () => void
};
const chatState = create<chatType>()(
  (set) => ({
    id : 0,
    setId : (id) => {
      set({id})
    },
    chat: [],
    setChat: (chat) => {
      set({ chat });
    },
    clearChat : () => {
      set({chat : []})
    }
    ,
    addMessage : (message) => {
      set((state) => {
        return {
          chat : [...state.chat, message]
        }
      })
    }}),
    
  )

 
const userState = create<userInterface>()(
    persist(
      (set) => ({
        user: "",
        setUser: (user) => {
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