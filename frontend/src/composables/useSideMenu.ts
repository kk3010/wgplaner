import { useToggle } from '@vueuse/core'

const [isOpen, toggle] = useToggle()

export function useSideMenu(){
    return {isOpen, toggle}
}