import Tour360Viewer from "../components/Tour360Viewer";
import { exampleTour } from "../data/tours/exampleTour";

function Tour360() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tour Virtual 360°</h1>

      <Tour360Viewer tour={exampleTour} />
    </div>
  );
}

export default Tour360;
