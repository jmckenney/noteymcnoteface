export const metricFunctionDefinitionForLlm = {
  name: "getRecentMetrics",
  description: "Get recent metric data for a patient such as weight, a1c.",
  parameters: {
    type: "object",
    properties: {
      metricType: { type: "string", enum: ["weight", "a1c"] },
    },
    required: ["metricType"],
  },
};

export const getRecentMetrics = (metricType) => {
  if (metricType === "weight") {
    return JSON.stringify({
      weight: 195,
    });
  } else {
    return JSON.stringify({
      a1c: 6.5,
    });
  }
};
