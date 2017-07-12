# Footer controller missleading

This is a stats controller, not footer(it was footer)

Should create a component out of this, also check the code if it is updated to new standards.


in context of timer ctrl it was also using this for loading the additional stats:
```
<!-- Not yet sure where to show the stats (separate page?) -->
<stats-total
        work-total="$ctrl.statsTotalWork"
        work-types="$ctrl.dayVisualizeWorkTypeTotals"
        flex="grow"
></stats-total>
```