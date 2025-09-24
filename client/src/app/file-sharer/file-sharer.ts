import { Component, inject, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { APP_CONFIG } from '../app.config';

@Component({
  selector: 'app-file-sharer',
  imports: [MatButtonModule, MatListModule, MatIconModule],
  templateUrl: './file-sharer.html',
  styleUrl: './file-sharer.scss',
})
export class FileSharer {
  private _http = inject(HttpClient);
  private _snackBar = inject(MatSnackBar);
  private _config = inject(APP_CONFIG);

  private readonly API_URL = `${this._config.backendUrl}/files`;
  selectedFile = signal<File | null>(null);
  files = httpResource<{ name: string }[]>(() => this.API_URL, {
    defaultValue: [],
  });

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  onUpload() {
    if (!this.selectedFile()) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile()!, this.selectedFile()!.name);

    this._http.post(`${this.API_URL}/upload`, formData).subscribe({
      next: () => {
        this.files.reload();
        this.selectedFile.set(null);
      },
      error: (err) => {
        this._snackBar.open(`Upload failed: ${err.message}`, '', {
          duration: 5000,
        });
      },
    });
  }

  onDownload(fileName: string) {
    window.location.href = `${this.API_URL}/download/${fileName}`;
  }

  onDelete(fileName: string) {
    this._http.delete(`${this.API_URL}/${fileName}`).subscribe({
      next: () => {
        this.files.reload();
      },
      error: (err) => {
        this._snackBar.open(`Delete failed: ${err.message}`, '', {
          duration: 5000,
        });
      },
    });
  }
}
