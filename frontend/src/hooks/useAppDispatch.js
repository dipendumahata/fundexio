import { useDispatch } from 'react-redux';

// সাধারণ useDispatch-কে র্যাপ করা হচ্ছে যাতে ফিউচারে টাইপস্ক্রিপ্ট বা মিডলওয়্যার সহজে হ্যান্ডেল করা যায়
export const useAppDispatch = () => useDispatch();