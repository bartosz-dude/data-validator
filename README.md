# Type validator

Validate any javascript data type and a few more

## Example

```typescript
validate({
    data1: 1,
    data2: "2"
}, {
    type: "object",
    properties: {
        data1: {
            type: "number",
            required: true,
            match: {
                min: 0
            }
        },
        data2: {
            type: "string",
            required: true,
            match: "2"
        }
    }
})
```
