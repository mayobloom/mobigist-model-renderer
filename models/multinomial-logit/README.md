# Multinomial Logistic Regression

Simple mode choice demo using utilities for car, transit, and bike.

The model uses:

```text
U_i = ASC_i + beta_time * time_i + beta_cost * cost_i
P_i = exp(U_i) / sum_j exp(U_j)
```

The coefficients are interpreted as marginal utility terms. Negative time and
cost coefficients produce lower choice probabilities as travel time or cost
increase.
