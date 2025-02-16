import modalReducer from '@/app/redux/feature/modal/modalSlice'
import baseApi from './api/baseApi'
import sidebarReducer from './feature/sidebar/sidebarSlice'

const reducer = {
  modal: modalReducer,
  sidebar: sidebarReducer,
  [baseApi.reducerPath]: baseApi.reducer,
}
export default reducer
