# Infrastructure Feasibility Analysis

Evaluates the economic viability of transportation infrastructure projects using time value of money concepts. It is useful for deciding whether a project should be funded and when it should be implemented.

## Formulas

```text
B/C = PV(Benefits) / PV(Costs)
NPV = PV(Benefits) - PV(Costs)
FYRR = Benefit(Year 1) / PV(Costs)
```

## Parameters

- `cost`: Initial construction cost incurred at Year 0 (Billion KRW).
- `benefit`: Annual benefit generated from Year 1 to the end of the duration (Billion KRW).
- `discount-rate`: Social discount rate applied to calculate present values (%).
- `duration`: The analysis period or lifespan of the infrastructure (Years).

## Outputs

- Main chart: A line chart tracking the Cumulative Net Present Value (NPV) over the project duration, clearly showing the break-even point.
- Metrics: Calculated B/C Ratio, NPV, IRR, and FYRR based on the input parameters.

## Notes

- **Limitation:** This model simplifies construction to a single period (Year 0) and assumes flat, constant annual benefits. Real-world demand forecasting (e.g., using KTDB data) usually produces fluctuating benefit curves.
- **FYRR Criticism:** Since this simulation assumes flat benefits, the FYRR remains constant regardless of the opening year. This demonstrates the structural limitations of applying standard FYRR logic without dynamic, time-variant demand modeling.
- **Decision Rule:** A project is generally considered economically viable if B/C >= 1, NPV >= 0, and IRR > Discount Rate.