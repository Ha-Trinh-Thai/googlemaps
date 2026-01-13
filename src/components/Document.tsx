export default function Document() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <section className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          Features
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">
              Interactive Map
            </h3>
            <p className="text-gray-700 text-sm">
              Smooth zoom, pan, and gesture controls for seamless navigation
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">
              Polygon Drawing
            </h3>
            <p className="text-gray-700 text-sm">
              Draw custom polygons to mark and highlight specific areas on the
              map
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">
              Walking Directions
            </h3>
            <p className="text-gray-700 text-sm">
              Get real-time walking routes with distance and duration estimates
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          Instructions
        </h2>
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors shadow-sm">
            <div className="flex gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                  Drawing Polygons
                </h3>
                <p className="text-gray-700 mb-2">
                  Use the drawing tools on the map to create custom polygons:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>
                    Click the <strong>Draw</strong> button to enter drawing mode
                  </li>
                  <li>
                    Click on the map to add points and create your polygon
                  </li>
                  <li>
                    Double-click or click the first point to complete the shape
                  </li>
                  <li>Drag vertices to adjust the polygon shape</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors shadow-sm">
            <div className="flex gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                  Editing & Deleting Polygons
                </h3>
                <p className="text-gray-700 mb-2">
                  Manage your polygons with these options:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>
                    Click the <strong>Move</strong> button to drag and
                    reposition polygons
                  </li>
                  <li>Right-click on any polygon to delete it individually</li>
                  <li>
                    Click the <strong>Delete</strong> button to remove all
                    polygons at once
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-green-300 transition-colors shadow-sm">
            <div className="flex gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                  Viewing Walking Directions
                </h3>
                <p className="text-gray-700 mb-2">
                  Navigation features are automatically displayed:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>
                    <strong>Red marker</strong> shows the destination (Marina
                    Bay Sands)
                  </li>
                  <li>
                    <strong>Blue marker</strong> shows the starting location
                  </li>
                  <li>Blue route line displays the walking path</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
