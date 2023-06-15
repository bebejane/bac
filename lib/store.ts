import { create } from "zustand";

export interface StoreState {
  showMenu: boolean,
  showMenuMobile: boolean,
  showSearch: boolean,
  searchQuery: string | undefined,
  images: ImageFileField[],
  imageId: string,
  setShowMenu: (showMenu: boolean) => void,
  setShowMenuMobile: (showMenuMobile: boolean) => void,
  setImages: (images: ImageFileField[] | undefined) => void
  setImageId: (imageId: string | undefined) => void,
  setShowSearch: (showSearch: boolean) => void,
  setSearchQuery: (searchQuery: string) => void
}

const useStore = create<StoreState>((set) => ({
  showMenu: false,
  showMenuMobile: false,
  showSearch: false,
  searchQuery: undefined,
  images: [],
  imageId: undefined,
  setShowMenu: (showMenu: boolean) =>
    set((state) => ({
      showMenu
    })
    ),
  setShowMenuMobile: (showMenuMobile: boolean) =>
    set((state) => ({
      showMenuMobile
    })
    ),
  setImageId: (imageId: string | undefined) =>
    set((state) => ({
      imageId
    })
    ),
  setImages: (images: ImageFileField[] | undefined) =>
    set((state) => ({
      images
    })
    ),
  setShowSearch: (showSearch: boolean) =>
    set((state) => ({
      showSearch
    })
    ),
  setSearchQuery: (searchQuery: string) =>
    set((state) => ({
      searchQuery
    })
    )
}));

export default useStore;
export { useStore };
