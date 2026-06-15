# Economic Order Quantity

Inventory model for the tradeoff between ordering and holding costs.

```text
Q* = sqrt(2DS / H)
TAC(Q) = DC + (D / Q)S + (Q / 2)H
ROP = dL
```

Where `D` is annual demand, `S` is ordering cost, `H` is annual holding cost per
unit, `C` is unit cost, `d` is daily demand, and `L` is lead time.
