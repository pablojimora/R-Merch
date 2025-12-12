export interface modalProps {
    open: () => void; 
    onClose: () => void;
    title: string; 
    text: string;
}