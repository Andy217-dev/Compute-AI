import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";


export const Store = configureStore({
	reducer: {
		
	}
})

export type AppDispatch = typeof Store.dispatch;
export type State = ReturnType<typeof Store.getState>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
