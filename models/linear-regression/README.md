# Simple Linear Regression

Introductory model for visualizing a linear relationship between trip distance
and travel time.

## Formula

Predicted travel time is calculated from a distance slope, `W`, and a fixed
intercept, `b`.

$$y = Wx + b$$

## Assumptions

- The model treats travel time as increasing linearly with trip distance.
- Severe congestion and unusual incidents are excluded.
- `b` represents fixed time that does not scale with distance, such as pickup,
  drop-off, or intersection delay.
- `W` represents additional minutes per kilometer under the simplified linear
  relationship.
