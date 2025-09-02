def sanitize_for_json(df):
    df = df.copy()
    for c in df.select_dtypes(include=["float", "int"]).columns:
        df[c] = df[c].fillna(0)
    df = df.fillna("").astype(object)
    return df
