import { create } from "zustand";


const useStore = create((set) => ({

    loading: false,
    setLoading: (value) => set(() => ({ loading: value }))


}))
export default useStore