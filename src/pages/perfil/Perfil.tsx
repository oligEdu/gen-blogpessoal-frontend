/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { AuthContext } from "../../context/AuthContext"
import { ToastAlerta } from "../../utils/ToastAlerta"

function Perfil() {
	const navigate = useNavigate()
	const { usuario } = useContext(AuthContext)
	const [fotoPerfilUrl, setFotoPerfilUrl] = useState("")

	// URLs alternativas para foto padrão (a primeira que funcionar será usada)
	const FOTOS_PADRAO = [
		"https://ui-avatars.com/api/?name=User&size=224&background=e5e7eb&color=6b7280&format=png",
		"https://via.placeholder.com/224x224/e5e7eb/6b7280?text=👤",
		"https://placehold.co/224x224/e5e7eb/6b7280/png?text=👤",
		"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='224' height='224' viewBox='0 0 24 24' fill='%236b7280'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"
	]

	useEffect(() => {
		if (usuario.token === "") {
			ToastAlerta("Você precisa estar logado", "info")
			navigate("/")
		}
	}, [usuario.token])

	// Determina a URL da foto do perfil
	useEffect(() => {
		const testarFotoPadrao = async () => {
			// Se não há foto cadastrada ou é string vazia
			if (!usuario.foto || usuario.foto.trim() === "") {
				// Testa as fotos padrão para encontrar uma que funcione
				for (const foto of FOTOS_PADRAO) {
					try {
						const img = new Image()
						await new Promise((resolve, reject) => {
							img.onload = resolve
							img.onerror = reject
							img.src = foto
						})
						setFotoPerfilUrl(foto)
						return
					} catch {
						continue
					}
				}
				// Se nenhuma funcionar, usa a última (SVG inline)
				setFotoPerfilUrl(FOTOS_PADRAO[FOTOS_PADRAO.length - 1])
			} else {
				// Testa a foto do usuário
				const img = new Image()
				img.onload = () => setFotoPerfilUrl(usuario.foto)
				img.onerror = () => {
					// Se falhar, usa a primeira foto padrão disponível
					testarFotoPadrao()
				}
				img.src = usuario.foto
			}
		}

		testarFotoPadrao()
	}, [usuario.foto])

	const handleImageError = () => {
		// Fallback adicional - usa a última opção (SVG inline) que sempre funciona
		const svgFallback = FOTOS_PADRAO[FOTOS_PADRAO.length - 1]
		if (fotoPerfilUrl !== svgFallback) {
			setFotoPerfilUrl(svgFallback)
		}
	}

	return (
		<div className="flex justify-center mx-4">
			<div className="container mx-auto my-4 rounded-2xl overflow-hidden">
				<img
					className="w-full h-72 object-cover border-b-8 border-white"
					src="https://i.imgur.com/ZZFAmzo.jpg"
					alt="Capa do Perfil"
				/>

				<img
					className="rounded-full w-56 mx-auto mt-[-8rem] border-8 border-white relative z-10"
					src={fotoPerfilUrl || FOTOS_PADRAO[0]}
					alt={`Foto de perfil de ${usuario.nome}`}
					onError={handleImageError}
				/>

				<div
					className="relative mt-[-6rem] h-72 flex flex-col 
                    bg-sky-500 text-white text-2xl items-center justify-center"
				>
					<p>Nome: {usuario.nome} </p>
					<p>Email: {usuario.usuario}</p>
				</div>
			</div>
		</div>
	)
}

export default Perfil