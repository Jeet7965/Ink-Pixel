const LoaderSpinner = () => {
  return (
    <div className="flex justify-center items-center w-full h-full py-20">
      <div className="h-12 w-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoaderSpinner;
