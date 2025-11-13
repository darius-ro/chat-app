import React, { useEffect, useState } from "react";

type submitFunction = (text: string) => Promise<boolean>;
/**
 * There might be better ways to make thing component but,
 * in my opinion, i would be happy with this in any scenario
 */
export default function InputBoxComponent({
  placeholder,
  disabled = false,
  onSubmitEvent,
  onAttachEvent,
}: Readonly<{
  placeholder?: string;
  disabled?: boolean;
  onSubmitEvent: submitFunction;
  onAttachEvent: VoidFunction;
}>) {
  const [text, setText] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(disabled);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isDisabled) return;
    const { value } = e.target;
    setText(value ?? "");
  };
  const submit = async () => {
    setIsDisabled(true);
    const value = await onSubmitEvent(text);
    setIsDisabled(false);
    if (value) {
      setText("");
    }
  };
  useEffect(() => {
    setIsDisabled(disabled);
  }, [disabled]);
  return (
    <div className="border-neutral-800 border rounded-2xl p-1">
      <textarea
        placeholder={placeholder ?? "Type your thoughts"}
        className="text-left p-2 rounded-2xl w-full h-full min-h-32 focus:outline-none"
        disabled={isDisabled}
        onChange={handleChange}
        value={text}
      />
      <div className="flex flex-row gap-x-1 mt-1 justify-end">
        <button
          className={`flex items-center justify-center gap-2 px-4 h-9 rounded-2xl 
             border border-neutral-800 
             bg-neutral-600 
             text-white font-medium 
             ${
               isDisabled
                 ? `cursor-not-allowed`
                 : `hover:border-neutral-700 hover:bg-neutral-700 cursor-pointer transition`
             }`}
          disabled={isDisabled}
          onClick={onAttachEvent}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>

          <span>Attach</span>
        </button>
        <button
          className={`flex items-center justify-center gap-2 px-4 h-9 rounded-2xl 
             border border-neutral-800 
             bg-blue-600 
             text-white font-medium 
              ${
                isDisabled
                  ? `cursor-not-allowed`
                  : `hover:border-neutral-700 hover:bg-blue-700 cursor-pointer transition`
              }`}
          disabled={isDisabled}
          onClick={() => submit()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499"
            />
          </svg>
          <span>Post</span>
        </button>
      </div>
    </div>
  );
}
