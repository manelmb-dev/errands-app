/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  safelist: [
    // Background colors
    "bg-[#F5F5F5]",
    "bg-[#FFFFFF]",
    "bg-[#CDE7E2]",
    "bg-[#CDC9FB]",
    "bg-[#6b7280]",
    "bg-[#121212]",
    "bg-[#1f2120]",
    // Text colors
    "text-[#007AFF]",
    "text-[#1E1E1E]",
    "text-[#3F3F3F]",
    "text-[#6E727A]",
    "text-[#A2A6AD]",
    "text-[#161618]",
    "text-[#BFBFBF]",
    "text-[#FDFDFD]",
    "text-[#4B4F55]",
    "text-[#FAFAFA]",
    "text-[#7A7A7A]",
    // Border colors
    "border-[#6E727A]",
    "border-[#6E727A]",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#F5F5F5",
          blueHeadText: "#007AFF",
          text: "#1E1E1E",
          buttonMenuBackground: "#FFFFFF",
          sendTaskButtonText: "#3F3F3F",
          taskTitle: "#1E1E1E",
          taskSecondText: "#6E727A",
          addNewTaskText: "#A2A6AD",
          submittedTaskToBg: "#CDE7E2",
          taskReceivedFromBg: "#CDC9FB",
          listTitle: "#161618",
          listsSeparator: "#6b7280",
        },
        dark: {
          background: "#121212",
          blueHeadText: "#007AFF",
          text: "#FDFDFD",
          buttonMenuBackground: "#1f2120",
          sendTaskButtonText: "#7A7A7A",
          taskTitle: "#FDFDFD",
          taskSecondText: "#6E727A",
          addNewTaskText: "#4B4F55",
          submittedTaskToBg: "#CDE7E2",
          taskReceivedFromBg: "#CDC9FB",
          listTitle: "#BFBFBF",
          listsSeparator: "#6b7280",
        },
      },
    },
  },
  plugins: [],
};
