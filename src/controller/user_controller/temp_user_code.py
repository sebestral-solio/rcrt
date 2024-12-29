def solve_problem(*args):
    # Factorial function example
    n = args[0]  # The input should be passed as the first argument
    if n == 0 or n == 1:
        return 1
    else:
        return n * solve_problem(n - 1) 


if __name__ == "__main__":
    import json
    test_cases = [0,1,5,7]
    results = []
    for test_case in test_cases:
        try:
            result = solve_problem(*test_case if isinstance(test_case, list) else [test_case])
            results.append(result)
        except Exception as e:
            results.append(f"Error: {str(e)}")
    print(json.dumps(results))
        