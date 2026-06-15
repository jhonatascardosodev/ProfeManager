def validation_error_message(error: dict) -> str:
    loc = error.get("loc", ())
    field = loc[-1] if loc else None
    err_type = error.get("type", "")

    if field == "email":
        return "Informe um e-mail válido."

    if field == "password":
        if err_type == "string_too_short":
            return "A senha deve ter pelo menos 6 caracteres."
        if err_type == "string_too_long":
            return "A senha é muito longa."
        return "Informe a senha."

    if field == "name":
        if err_type == "string_too_short":
            return "Informe seu nome."
        return "Nome inválido."

    if field == "token":
        return "Link de redefinição inválido."

    return "Dados inválidos. Verifique os campos e tente novamente."
