import Filter from "../others/filter"

const Color = {
  render: function(contexts, scope, evaluated, filter_config) {
    var context = contexts[0]; // one input
    var new_context = Filter.create_drawing_like(context, Filter.label(filter_config) + ' ' + evaluated.color);
    new_context.context.fillStyle = evaluated.color;
    new_context.context.fillRect(0, 0, new_context.canvas.width, new_context.canvas.height);
    return [new_context];
  },
  parameters: [
    { name: "color", value: "color" },
    { name: "size", value: "mm_dimensions" },
    { name: "duration", value: "mm_duration" },
    { name: "rate", value: "mm_fps" },
  ],
}

Filter.register('color', Color);
export default Color